from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
from lxml import html
import time

TEST_URL = "https://zukan.inazuma.jp/en/chara/1/"  # Evans

print("=== DÉMARRAGE DU DEBUG ===\n")

# Configuration Chrome
options = webdriver.ChromeOptions()
# NE PAS mettre en headless pour voir ce qui se passe
# options.add_argument("--headless")
options.add_argument("--disable-blink-features=AutomationControlled")

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
driver.set_page_load_timeout(30)

try:
    print(f"1️⃣ Chargement de la page: {TEST_URL}")
    driver.get(TEST_URL)
    
    print("2️⃣ Attente du chargement complet...")
    time.sleep(5)  # Attendre 5 secondes pour que tout se charge
    
    print("3️⃣ Recherche de l'élément principal...")
    
    # Essayons différents sélecteurs pour voir ce qui existe
    selectors_to_test = [
        ("ID paramFilterForm", By.ID, "paramFilterForm"),
        ("ID wrap", By.ID, "wrap"),
        ("Class container", By.CLASS_NAME, "container"),
        ("Tag body", By.TAG_NAME, "body"),
    ]
    
    for name, by_type, selector in selectors_to_test:
        try:
            element = WebDriverWait(driver, 3).until(
                EC.presence_of_element_located((by_type, selector))
            )
            print(f"   ✅ {name} trouvé !")
        except:
            print(f"   ❌ {name} NON trouvé")
    
    print("\n4️⃣ Extraction du HTML complet...")
    tree = html.fromstring(driver.page_source)
    
    # Test des XPath
    print("\n5️⃣ Test des XPath:\n")
    
    xpaths_to_test = {
        "Position": '//*[@id="paramFilterForm"]/div/div[2]/ul[1]/li/div[2]/div[2]/ul[1]/li[1]/dl[1]/dd/p',
        "Game": '//*[@id="paramFilterForm"]/div/div[2]/ul[1]/li/div[2]/div[2]/dl[1]/dd',
        "Description": '//*[@id="paramFilterForm"]/div/div[2]/ul[1]/li/div[2]/div[2]/p',
        "Element": '//*[@id="paramFilterForm"]/div/div[2]/ul[1]/li/div[2]/div[2]/ul[1]/li[1]/dl[2]/dd/p',
    }
    
    for name, xpath in xpaths_to_test.items():
        try:
            elements = tree.xpath(xpath)
            if elements:
                text = elements[0].text_content().strip()
                print(f"✅ {name}: '{text[:100]}'")
            else:
                print(f"❌ {name}: XPath ne retourne rien")
        except Exception as e:
            print(f"❌ {name}: ERREUR - {e}")
    
    # Essayons des XPath plus simples
    print("\n6️⃣ Test avec des XPath alternatifs:\n")
    
    alternative_xpaths = {
        "Game (alt 1)": '//dl[1]/dd',
        "Game (alt 2)": '//dt[contains(text(), "Game")]/following-sibling::dd',
        "Description (alt 1)": '//p[@class="text"]',
        "Description (alt 2)": '//div[contains(@class, "detail")]//p',
        "Tous les DD": '//dd',
        "Tous les P": '//p',
    }
    
    for name, xpath in alternative_xpaths.items():
        try:
            elements = tree.xpath(xpath)
            if elements:
                if len(elements) > 1:
                    print(f"ℹ️  {name}: {len(elements)} éléments trouvés")
                    for i, el in enumerate(elements[:3]):  # Afficher les 3 premiers
                        text = el.text_content().strip()[:60]
                        print(f"    [{i}]: {text}")
                else:
                    text = elements[0].text_content().strip()[:100]
                    print(f"✅ {name}: '{text}'")
            else:
                print(f"❌ {name}: Rien trouvé")
        except Exception as e:
            print(f"❌ {name}: ERREUR - {e}")
    
    # Sauvegarder le HTML pour inspection
    print("\n7️⃣ Sauvegarde du HTML...")
    with open("page_debug.html", "w", encoding="utf-8") as f:
        f.write(driver.page_source)
    print("   ✅ HTML sauvegardé dans 'page_debug.html'")
    
    print("\n8️⃣ Regardons la structure générale...")
    
    # Essayons de trouver des éléments avec "game" dans le texte
    game_elements = tree.xpath('//*[contains(translate(text(), "GAME", "game"), "game")]')
    if game_elements:
        print(f"   ℹ️  Trouvé {len(game_elements)} éléments contenant 'game'")
        for i, el in enumerate(game_elements[:3]):
            print(f"      [{i}] Tag: {el.tag}, Text: {el.text_content().strip()[:50]}")
    
    print("\n=== FIN DU DEBUG ===")
    print("\n💡 CONSEIL:")
    print("   1. Ouvrez 'page_debug.html' dans un éditeur de texte")
    print("   2. Cherchez (Ctrl+F) le mot 'Inazuma Eleven' ou 'Game'")
    print("   3. Regardez la structure HTML autour")
    print("   4. Cela vous donnera les bons XPath à utiliser")
    
    input("\nAppuyez sur Entrée pour fermer le navigateur...")
    
except Exception as e:
    print(f"\n❌ ERREUR GLOBALE: {e}")
    import traceback
    traceback.print_exc()
    
finally:
    driver.quit()
    print("\n✅ Navigateur fermé")
    