from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from lxml import html
import psycopg2
from psycopg2.extras import execute_values
import time
import queue
import threading

BASE_URL = "https://zukan.inazuma.jp"
LIST_URL = "https://zukan.inazuma.jp/en/chara_list/?page={}"

XPATHS = {
    "Position": '//*[@id="paramFilterForm"]/div/div[2]/ul[1]/li/div[2]/div[2]/ul[1]/li[1]/dl[1]/dd/p',
    "Element": '//*[@id="paramFilterForm"]/div/div[2]/ul[1]/li/div[2]/div[2]/ul[1]/li[1]/dl[2]/dd/p',
    "Kick": '//*[@id="paramFilterForm"]/div/div[2]/ul[1]/li/div[2]/div[2]/ul[1]/li[2]/dl/dd/table/tbody/tr[2]/td',
    "Control": '//*[@id="paramFilterForm"]/div/div[2]/ul[1]/li/div[2]/div[2]/ul[1]/li[3]/dl/dd/table/tbody/tr[2]/td',
    "Technique": '//*[@id="paramFilterForm"]/div/div[2]/ul[1]/li/div[2]/div[2]/ul[1]/li[4]/dl/dd/table/tbody/tr[2]/td',
    "Pressure": '//*[@id="paramFilterForm"]/div/div[2]/ul[1]/li/div[2]/div[2]/ul[1]/li[5]/dl/dd/table/tbody/tr[2]/td',
    "Physical": '//*[@id="paramFilterForm"]/div/div[2]/ul[1]/li/div[2]/div[2]/ul[1]/li[6]/dl/dd/table/tbody/tr[2]/td',
    "Agility": '//*[@id="paramFilterForm"]/div/div[2]/ul[1]/li/div[2]/div[2]/ul[1]/li[7]/dl/dd/table/tbody/tr[2]/td',
    "Intelligence": '//*[@id="paramFilterForm"]/div/div[2]/ul[1]/li/div[2]/div[2]/ul[1]/li[8]/dl/dd/table/tbody/tr[2]/td',
    "Game": "//dl[@class='appearedWorks']/dd",
    "Description": '//p[@class="description"]'
}

IMAGE_XPATH = '//*[@id="paramFilterForm"]/div/div[2]/ul[1]/li/div[2]/div[1]/figure/picture/source'

# Configuration PostgreSQL
DB_CONFIG = {
    'dbname': 'postgres',
    'user': 'postgres.ygwefkgcmeqldzplecbo',
    'password': '2KwCNpzGp8jCJqGd',
    'host': 'aws-1-eu-west-3.pooler.supabase.com',
    'port': '5432'
}

_DRIVER_PATH = None
_driver_lock = threading.Lock()
_db_lock = threading.Lock()

def get_driver_path():
    global _DRIVER_PATH
    if _DRIVER_PATH is None:
        with _driver_lock:
            if _DRIVER_PATH is None:
                _DRIVER_PATH = ChromeDriverManager().install()
    return _DRIVER_PATH

def create_driver():
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("--disable-extensions")
    options.add_argument("--disable-images")
    options.page_load_strategy = 'eager'
    
    driver = webdriver.Chrome(service=Service(get_driver_path()), options=options)
    driver.set_page_load_timeout(10)
    return driver

def init_database():
    """Crée la base de données et les tables si elles n'existent pas"""
    try:
        # Connexion au serveur PostgreSQL (base 'postgres' par défaut)
        conn = psycopg2.connect(
            dbname='postgres',
            user=DB_CONFIG['user'],
            password=DB_CONFIG['password'],
            host=DB_CONFIG['host'],
            port=DB_CONFIG['port']
        )
        conn.autocommit = True
        cur = conn.cursor()
        
        # Créer la base de données si elle n'existe pas
        cur.execute(f"SELECT 1 FROM pg_database WHERE datname = '{DB_CONFIG['dbname']}'")
        if not cur.fetchone():
            cur.execute(f"CREATE DATABASE {DB_CONFIG['dbname']}")
            print(f"✓ Base de données '{DB_CONFIG['dbname']}' créée")
        
        cur.close()
        conn.close()
        
        # Connexion à la nouvelle base de données
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        
        # Créer la table des joueurs
        cur.execute("""
            CREATE TABLE IF NOT EXISTS players (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                position VARCHAR(50),
                element VARCHAR(50),
                kick INTEGER,
                control INTEGER,
                technique INTEGER,
                pressure INTEGER,
                physical INTEGER,
                agility INTEGER,
                intelligence INTEGER,
                image_url TEXT,
                player_url TEXT UNIQUE,
                shot_attack INTEGER,
                focus_atk INTEGER,
                focus_def INTEGER,
                castle_wall INTEGER,
                gk_stats INTEGER,
                game varchar(250),
                description varchar(300),
                UNIQUE(name, position, element, kick, control, technique, pressure, physical, agility, intelligence, game, description)
            )
        """)
        
        # Créer des index pour améliorer les performances
        cur.execute("CREATE INDEX IF NOT EXISTS idx_name ON players(name)")
        cur.execute("CREATE INDEX IF NOT EXISTS idx_position ON players(position)")
        cur.execute("CREATE INDEX IF NOT EXISTS idx_element ON players(element)")
        
        conn.commit()
        cur.close()
        conn.close()
        
        print("✓ Table 'players' créée avec succès")
        
    except Exception as e:
        print(f"❌ Erreur lors de l'initialisation de la base de données: {e}")
        raise

def insert_player_to_db(player_data):
    """Insère un joueur dans la base de données"""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        
        cur.execute("""
            INSERT INTO players (
                name, position, element, kick, control, technique, 
                pressure, physical, agility, intelligence, image_url, 
                player_url, shot_attack, focus_atk, focus_def, 
                castle_wall, gk_stats, game, description
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (player_url) DO NOTHING
            RETURNING id
        """, player_data)
        
        result = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        
        return result is not None  # True si inséré, False si déjà existant
        
    except Exception as e:
        print(f"❌ Erreur lors de l'insertion: {e}")
        return False

def extract_single_player(driver, name, player_url):
    try:
        driver.get(player_url)
        WebDriverWait(driver, 8).until(
            EC.presence_of_element_located((By.XPATH, XPATHS["Position"]))
        )
        
        tree = html.fromstring(driver.page_source)

        try:
            img_el = tree.xpath(IMAGE_XPATH)
            img_url = img_el[0].get("srcset") or img_el[0].get("src")
            if img_url:
                img_url = img_url.split(" ")[0]
        except:
            img_url = ""

        stats = []
        for stat_name, xpath in XPATHS.items():
            el = tree.xpath(xpath)
            value = el[0].text_content().strip() if el else ""
            if stat_name not in ["Position", "Element", "Game", "Description"]:
                try:
                    value = int(value)
                except:
                    value = 0
            stats.append(value)

        Position, Element, Kick, Control, Technique, Pressure, Physical, Agility, Intelligence, Game, Description = stats

        # Calculs des statistiques dérivées
        ShotAttack = Kick + Control
        FocusATK = Technique + Control
        FocusDEF = Technique + Intelligence
        CastleWALL = Pressure + Physical
        GKStats = Agility + Physical

        player_data = (
            name, Position, Element, Kick, Control, Technique,
            Pressure, Physical, Agility, Intelligence, img_url,
            player_url, ShotAttack, FocusATK, FocusDEF,
            CastleWALL, GKStats, Game, Description
        )
        
        return player_data
        
    except Exception as e:
        return None

def worker_thread(player_queue, results_queue, worker_id):
    driver = create_driver()
    processed = 0
    
    try:
        while True:
            try:
                player_info = player_queue.get(timeout=1)
                if player_info is None:
                    break
                
                name, player_url = player_info
                result = extract_single_player(driver, name, player_url)
                
                if result:
                    with _db_lock:
                        inserted = insert_player_to_db(result)
                        results_queue.put(('success', inserted))
                else:
                    results_queue.put(('error', None))
                
                processed += 1
                player_queue.task_done()
                
            except queue.Empty:
                continue
            except Exception as e:
                results_queue.put(('error', None))
                player_queue.task_done()
                
    finally:
        driver.quit()

def get_all_player_links(driver):
    all_players = []
    page_num = 1
    
    while True:
        url = LIST_URL.format(page_num)
        print(f"Page {page_num}...", end=" ")
        
        try:
            driver.get(url)
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, '//*[@id="wrap"]/div[2]/div/div/table/tbody/tr'))
            )
        except:
            print("Fin")
            break

        rows = driver.find_elements(By.XPATH, '//*[@id="wrap"]/div[2]/div/div/table/tbody/tr')
        if not rows:
            break

        page_players = []
        for row in rows:
            try:
                link = row.find_element(By.XPATH, './td[3]/div/p/a')
                name = link.text.strip()
                player_url = link.get_attribute("href")
                page_players.append((name, player_url))
            except:
                continue

        all_players.extend(page_players)
        print(f"{len(page_players)} joueurs (Total: {len(all_players)})")
        page_num += 1

    return all_players

# ============ MAIN ============
if __name__ == "__main__":
    print("=== Initialisation de la base de données ===")
    init_database()
    
    print("\n=== Récupération de la liste des joueurs ===")
    main_driver = create_driver()
    all_players = get_all_player_links(main_driver)
    main_driver.quit()
    
    print(f"\nTotal: {len(all_players)} joueurs à extraire\n")
    
    NUM_WORKERS = 4
    player_queue = queue.Queue()
    results_queue = queue.Queue()
    
    for player in all_players:
        player_queue.put(player)
    
    for _ in range(NUM_WORKERS):
        player_queue.put(None)
    
    start_time = time.time()
    threads = []
    
    for i in range(NUM_WORKERS):
        t = threading.Thread(target=worker_thread, args=(player_queue, results_queue, i+1))
        t.start()
        threads.append(t)
    
    inserted_count = 0
    duplicate_count = 0
    errors = 0
    last_update = time.time()
    
    while any(t.is_alive() for t in threads) or not results_queue.empty():
        try:
            result_type, inserted = results_queue.get(timeout=0.5)
            
            if result_type == 'success':
                if inserted:
                    inserted_count += 1
                else:
                    duplicate_count += 1
            else:
                errors += 1
            
            if time.time() - last_update > 2:
                completed = inserted_count + duplicate_count + errors
                elapsed = time.time() - start_time
                rate = completed / elapsed if elapsed > 0 else 0
                remaining = (len(all_players) - completed) / rate if rate > 0 else 0
                progress = completed / len(all_players) * 100
                
                print(f"✓ {completed}/{len(all_players)} ({progress:.1f}%) | Insérés: {inserted_count} | Doublons: {duplicate_count} | Erreurs: {errors} | {remaining/60:.1f}min restant")
                last_update = time.time()
                
        except queue.Empty:
            continue
    
    for t in threads:
        t.join()
    
    total_time = time.time() - start_time
    print(f"\n{'='*60}")
    print(f"✓ Terminé en {total_time/60:.1f} minutes")
    print(f"✓ Joueurs insérés: {inserted_count}")
    print(f"✓ Doublons ignorés: {duplicate_count}")
    print(f"✓ Erreurs: {errors}")
    print(f"✓ Vitesse moyenne: {len(all_players)/total_time:.1f} joueurs/s")
    print(f"{'='*60}")