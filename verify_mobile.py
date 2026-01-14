from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        # Emulate iPhone 12 Pro
        iphone_12 = p.devices['iPhone 12 Pro']
        context = browser.new_context(**iphone_12)
        page = context.new_page()

        # Load the page
        page.goto(f"file://{os.path.abspath('index.html')}")
        page.wait_for_selector('.location-item') # Wait for content
        page.wait_for_timeout(1000) # Wait for animations

        # Screenshot 1: Mobile View (Map + Bottom Sheet + FAB)
        page.screenshot(path='mobile_view.png')
        print("Captured mobile_view.png")

        # Click the FAB to open Itinerary
        page.click('#mobile-trip-fab')

        # Wait for panel to open (check for class 'open')
        page.wait_for_selector('#itinerary-panel.open')
        page.wait_for_timeout(500) # Wait for transition

        # Screenshot 2: Itinerary Open
        page.screenshot(path='mobile_itinerary_open.png')
        print("Captured mobile_itinerary_open.png")

        # Close via Backdrop
        page.click('#mobile-backdrop')
        page.wait_for_timeout(500)

        # Check if closed
        is_open = page.evaluate("document.getElementById('itinerary-panel').classList.contains('open')")
        if not is_open:
            print("Panel closed successfully via backdrop.")
        else:
            print("Error: Panel did not close.")

        browser.close()

if __name__ == "__main__":
    run()
