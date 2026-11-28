use tauri::{
  App, AppHandle, Emitter, EventTarget, Manager, WebviewWindow,
  menu::{Menu, MenuItem},
  tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
};

fn reveal(app: &AppHandle) -> Option<WebviewWindow> {
  let windows = app.webview_windows();
  for window in windows.values() {
    let _ = window.show();
  }
  let window = windows.get("main").or_else(|| windows.values().next())?;
  let _ = window.unminimize();
  let _ = window.set_focus();
  Some(window.clone())
}

pub fn setup(app: &App) -> tauri::Result<()> {
  let show = MenuItem::with_id(app, "tray-show", "Afișează aplicația", true, None::<&str>)?;
  let hide = MenuItem::with_id(app, "tray-hide", "Ascunde ferestrele", true, None::<&str>)?;
  let quit = MenuItem::with_id(app, "tray-quit", "Închide aplicația", true, None::<&str>)?;
  let menu = Menu::with_items(app, &[&show, &hide, &quit])?;

  let mut tray = TrayIconBuilder::with_id("journal")
    .menu(&menu)
    .tooltip("Jurnal Meditații")
    .show_menu_on_left_click(false)
    .on_tray_icon_event(|tray, event| {
      if matches!(event, TrayIconEvent::Click { button: MouseButton::Left, button_state: MouseButtonState::Up, .. }) {
        reveal(tray.app_handle());
      }
    })
    .on_menu_event(|app, event| match event.id().as_ref() {
      "tray-show" => {
        reveal(app);
      }
      "tray-hide" => {
        for window in app.webview_windows().values() {
          let _ = window.hide();
        }
      }
      "tray-quit" => {
        if let Some(window) = reveal(app) {
          let _ = app.emit_to(EventTarget::window(window.label()), "journal-tray-close", ());
        }
      }
      _ => {}
    });
  if let Some(icon) = app.default_window_icon() {
    tray = tray.icon(icon.clone());
  }
  tray.build(app)?;
  Ok(())
}
