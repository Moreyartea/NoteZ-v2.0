package com.moreyartea.notez;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Refresh live widgets upon launch
        NoteZWidgetProvider.refreshAllWidgets(this);
    }

    @Override
    public void onResume() {
        super.onResume();
        // Refresh live widgets upon resume
        NoteZWidgetProvider.refreshAllWidgets(this);
    }

    @Override
    public void onPause() {
        super.onPause();
        // Trigger live refresh immediately when user exits to home screen
        NoteZWidgetProvider.refreshAllWidgets(this);
    }
}
