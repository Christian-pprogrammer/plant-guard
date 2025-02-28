package com.platguard

import android.content.Intent
import android.graphics.Color
import android.net.Uri
import android.os.Bundle
import android.util.Log
import androidx.lifecycle.MutableLiveData
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.bridge.ReactContext
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.shell.MainReactPackage
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.google.android.material.snackbar.Snackbar
import com.google.android.play.core.appupdate.AppUpdateInfo
import com.google.android.play.core.appupdate.AppUpdateManager
import com.google.android.play.core.appupdate.AppUpdateManagerFactory
import com.google.android.play.core.appupdate.AppUpdateOptions
import com.google.android.play.core.install.InstallState
import com.google.android.play.core.install.InstallStateUpdatedListener
import com.google.android.play.core.install.model.InstallStatus
import com.google.android.play.core.install.model.UpdateAvailability
import com.google.android.play.core.install.model.AppUpdateType
import com.zoontek.rnbootsplash.RNBootSplash
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch

class MainActivity : ReactActivity() {

    private lateinit var appUpdateManager: AppUpdateManager
    private val updateAvailable = MutableLiveData<Boolean>().apply { value = false }
    private var updateInfo: AppUpdateInfo? = null

    private val updateListener = InstallStateUpdatedListener { state ->
        commonLog("Update01: $state")
        if (state.installStatus() == InstallStatus.DOWNLOADED) {
            showUpdateSnackbar()
        }
    }

    private fun checkForUpdates() {
        appUpdateManager.appUpdateInfo.addOnSuccessListener { info ->
            if (info.updateAvailability() == UpdateAvailability.UPDATE_AVAILABLE && info.isUpdateTypeAllowed(AppUpdateType.IMMEDIATE)) {
                updateInfo = info
                updateAvailable.value = true
                commonLog("update01: Version code available ${info.availableVersionCode()}")
                startForInAppUpdate(updateInfo)
            } else {
                updateAvailable.value = false
                commonLog("update01: Update not available")
            }
        }
    }

    private fun startForInAppUpdate(info: AppUpdateInfo?) {
        info?.let {
            appUpdateManager.startUpdateFlowForResult(
                it,
                AppUpdateType.IMMEDIATE,
                this,
                1101
            )
        }
    }

    private fun showUpdateSnackbar() {
        try {
            Snackbar.make(
                findViewById(android.R.id.content),
                "An update has just been downloaded.",
                Snackbar.LENGTH_INDEFINITE
            )
                .setAction("RESTART") {
                    appUpdateManager.completeUpdate()
                }
                .setActionTextColor(Color.parseColor("#FFFF4444"))
                .show()
        } catch (e: Exception) {
            commonLog("Error showing snackbar: ${e.message}")
        }
    }

    private fun commonLog(message: String) {
        Log.d("tag001", message)
    }

    override fun getMainComponentName(): String {
        return "sec_mobile"
    }

    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        RNBootSplash.init(this, R.style.BootTheme) // initialize the splash screen
        super.onCreate(savedInstanceState)
        appUpdateManager = AppUpdateManagerFactory.create(this)
        appUpdateManager.registerListener(updateListener)
        checkForUpdates()

        // Handle deep link if app was started via a deep link
        handleIntent(intent)
    }

    override fun onNewIntent(intent: Intent?) {
        super.onNewIntent(intent)
        handleIntent(intent)
    }

    private fun handleIntent(intent: Intent?) {
        intent?.data?.let { uri: Uri ->
            // Handle the deep link URL here
            commonLog("Deep link received: $uri")

            // Example: If your React Native app has a method to handle the deep link
            // you can use DeviceEventManagerModule to send the link to JavaScript
            val reactContext = reactInstanceManager.currentReactContext
            reactContext?.let {
                it.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("DeepLinkReceived", uri.toString())
            }
        }
    }

    override fun onBackPressed() {
        super.onBackPressed()
        try {
            appUpdateManager.unregisterListener(updateListener)
        } catch (e: Exception) {
            commonLog("Error unregistering listener: ${e.message}")
        }
    }
}
