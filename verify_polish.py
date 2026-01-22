from playwright.sync_api import sync_playwright

def verify_mobile_ui():
    with sync_playwright() as p:
        # iPhone 12 Pro emulation
        iphone = p.devices['iPhone 12 Pro']
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(**iphone)
        page = context.new_page()

        # Load file
        import os
        page.goto(f"file://{os.path.abspath('index.html')}")

        # Wait for map and content
        page.wait_for_selector(".location-item")

        # 1. Capture Initial Mobile View (Bottom Sheet Half Open)
        page.screenshot(path="mobile_view_polish.png")
        print("Captured mobile_view_polish.png")

        # 2. Test Mobile Interactions
        # Tap first item to open it (fly to map logic)
        first_item = page.locator(".location-item").first
        first_item.click()
        page.wait_for_timeout(1000) # Wait for fly-to

        # Tap Add Button
        add_btn = first_item.locator(".add-sidebar-btn")
        add_btn.click()
        page.wait_for_timeout(1000) # Wait for toast and fab animation

        page.screenshot(path="mobile_interaction_polish.png")
        print("Captured mobile_interaction_polish.png")

        # 3. Open Itinerary (Click FAB)
        page.locator("#mobile-trip-fab").click()
        page.wait_for_selector("#itinerary-panel.open")
        page.wait_for_timeout(500)

        page.screenshot(path="mobile_itinerary_polish.png")
        print("Captured mobile_itinerary_polish.png")

        browser.close()

def verify_desktop_ui():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1440, 'height': 900})

        import os
        page.goto(f"file://{os.path.abspath('index.html')}")

        # Wait for content
        page.wait_for_selector(".location-item")

        # 1. Capture Desktop View
        page.screenshot(path="desktop_view_polish.png")
        print("Captured desktop_view_polish.png")

        # 2. Hover Interaction (Simulate hover on first item)
        page.hover(".location-item")
        page.wait_for_timeout(300)
        page.screenshot(path="desktop_hover_polish.png")
        print("Captured desktop_hover_polish.png")

        # 3. Open Modal
        # Trigger map fly-to
        page.click(".location-item")
        page.wait_for_timeout(1000)

        # Click "Details" in popup
        page.click(".more-info-btn")
        page.wait_for_selector("#location-modal.show")
        page.wait_for_timeout(500) # Wait for stagger

        page.screenshot(path="desktop_modal_polish.png")
        print("Captured desktop_modal_polish.png")

        browser.close()

if __name__ == "__main__":
    verify_mobile_ui()
    verify_desktop_ui()
