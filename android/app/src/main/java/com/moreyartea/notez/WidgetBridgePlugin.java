package com.moreyartea.notez;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "WidgetBridge")
public class WidgetBridgePlugin extends Plugin {

    @PluginMethod
    public void refreshWidget(PluginCall call) {
        try {
            NoteZWidgetProvider.refreshAllWidgets(getContext());
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to refresh widget", e);
        }
    }
}

