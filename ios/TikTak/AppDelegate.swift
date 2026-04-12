import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "TikTak",
      in: window,
      launchOptions: launchOptions
    )

    return true
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    // Metro tapılmadıqda və ya main.jsbundle yoxdursa jsBundleURL nil ola bilər → "No script URL provided"
    if let url = RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index") {
      return url
    }
#if targetEnvironment(simulator)
    return Self.debugMetroBundleURL()
#else
    return nil
#endif
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }

  /// Simulator üçün: Metro işləyəndə standart dev bundle URL-i (8081).
  private static func debugMetroBundleURL() -> URL? {
    var components = URLComponents()
    components.scheme = "http"
    components.host = "127.0.0.1"
    components.port = 8081
    components.path = "/index.bundle"
    var items: [URLQueryItem] = [
      URLQueryItem(name: "platform", value: "ios"),
      URLQueryItem(name: "dev", value: "true"),
      URLQueryItem(name: "lazy", value: "true"),
      URLQueryItem(name: "minify", value: "false"),
      URLQueryItem(name: "inlineSourceMap", value: "false"),
      URLQueryItem(name: "modulesOnly", value: "false"),
      URLQueryItem(name: "runModule", value: "true"),
    ]
    if let id = Bundle.main.bundleIdentifier {
      items.append(URLQueryItem(name: "app", value: id))
    }
    components.queryItems = items
    return components.url
  }
}
