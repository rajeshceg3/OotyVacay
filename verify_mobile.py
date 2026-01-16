from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()

        # --- Mobile Verification ---
        print("Verifying Mobile...")
        iphone_12 = p.devices['iPhone 12 Pro']
        context_mobile = browser.new_context(**iphone_12)
        page_mobile = context_mobile.new_page()

        page_mobile.goto(f"file://{os.path.abspath('index.html')}")
        page_mobile.wait_for_selector('.location-item')
        page_mobile.wait_for_timeout(2000) # Wait for animations

        page_mobile.screenshot(path='mobile_view.png')
        print("Captured mobile_view.png")

        # Open Itinerary
        try:
            page_mobile.click('#mobile-trip-fab', timeout=2000)
            page_mobile.wait_for_selector('#itinerary-panel.open')
            page_mobile.wait_for_timeout(1000)
            page_mobile.screenshot(path='mobile_itinerary_open.png')
            print("Captured mobile_itinerary_open.png")

            # Close it
            page_mobile.click('#mobile-backdrop')
        except Exception as e:
            print(f"Mobile interaction warning: {e}")

        # --- Desktop Verification ---
        print("Verifying Desktop...")
        context_desktop = browser.new_context(viewport={'width': 1920, 'height': 1080})
        page_desktop = context_desktop.new_page()

        page_desktop.goto(f"file://{os.path.abspath('index.html')}")
        page_desktop.wait_for_selector('.location-item')
        page_desktop.wait_for_timeout(2000)

        page_desktop.screenshot(path='desktop_view.png')
        print("Captured desktop_view.png")

        # Click a marker to see popup
        # This is tricky with Leaflet canvas/SVG, but we can try clicking the first location item which flies to marker and opens popup
        page_desktop.click('.location-item:first-child')
        page_desktop.wait_for_timeout(2000) # Wait for flyTo and popup open
        page_desktop.screenshot(path='desktop_popup.png')
        print("Captured desktop_popup.png")

        # Open Modal
        # Click the "Details" button in the popup we just opened?
        # Or click the "Details" button in the sidebar item (Wait, sidebar item only has Add button visible by default? No, I added details button in popup)

        # Let's try to find the "Details" button in the open popup
        try:
            page_desktop.click('.more-info-btn', timeout=3000)
            page_desktop.wait_for_selector('#location-modal.show')
            page_desktop.wait_for_timeout(1000)
            page_desktop.screenshot(path='desktop_modal.png')
            print("Captured desktop_modal.png")
        except Exception as e:
            print(f"Desktop interaction warning: {e}")

        browser.close()

if __name__ == "__main__":
    run()
