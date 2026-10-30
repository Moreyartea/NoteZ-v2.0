package com.moreyartea.notez

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.view.View
import android.widget.RemoteViews
import org.json.JSONObject

/**
 * NoteZ Neo-Brutalism Native Android Widget Provider
 * Displays top priority tasks for today, synced from Capacitor Preferences (CapacitorStorage)
 */
class NoteZWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }
    }

    override fun onReceive(context: Context, intent: Intent) {
        super.onReceive(context, intent)
        if (intent.action == ACTION_UPDATE_WIDGET ||
            intent.action == AppWidgetManager.ACTION_APPWIDGET_UPDATE
        ) {
            val appWidgetManager = AppWidgetManager.getInstance(context)
            val thisWidget = ComponentName(context, NoteZWidgetProvider::class.java)
            val appWidgetIds = appWidgetManager.getAppWidgetIds(thisWidget)
            for (appWidgetId in appWidgetIds) {
                updateAppWidget(context, appWidgetManager, appWidgetId)
            }
        }
    }

    companion object {
        const val ACTION_UPDATE_WIDGET = "com.moreyartea.notez.ACTION_UPDATE_WIDGET"
        private const val PREFS_NAME = "CapacitorStorage"
        private const val KEY_TODOS = "widget_todos_data"

        fun updateAppWidget(
            context: Context,
            appWidgetManager: AppWidgetManager,
            appWidgetId: Int
        ) {
            val views = RemoteViews(context.packageName, R.layout.widget_notez_tasks)

            // Setup click intent to launch MainActivity
            val launchIntent = Intent(context, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            }
            val pendingIntent = PendingIntent.getActivity(
                context,
                0,
                launchIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.widget_root_layout, pendingIntent)

            // Read JSON from CapacitorStorage SharedPreferences
            val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            val todosJsonStr = prefs.getString(KEY_TODOS, null)

            val rowIds = intArrayOf(
                R.id.widget_row_1,
                R.id.widget_row_2,
                R.id.widget_row_3,
                R.id.widget_row_4,
                R.id.widget_row_5
            )
            val cbIds = intArrayOf(
                R.id.widget_cb_1,
                R.id.widget_cb_2,
                R.id.widget_cb_3,
                R.id.widget_cb_4,
                R.id.widget_cb_5
            )
            val titleIds = intArrayOf(
                R.id.widget_title_1,
                R.id.widget_title_2,
                R.id.widget_title_3,
                R.id.widget_title_4,
                R.id.widget_title_5
            )
            val badgeIds = intArrayOf(
                R.id.widget_badge_1,
                R.id.widget_badge_2,
                R.id.widget_badge_3,
                R.id.widget_badge_4,
                R.id.widget_badge_5
            )

            if (!todosJsonStr.isNullOrEmpty()) {
                try {
                    val json = JSONObject(todosJsonStr)
                    val completedCount = json.optInt("completedCount", 0)
                    val totalCount = json.optInt("totalCount", 0)
                    val items = json.optJSONArray("items")

                    views.setTextViewText(R.id.widget_tv_counter, "$completedCount/$totalCount")

                    val itemCount = items?.length() ?: 0
                    if (itemCount == 0) {
                        views.setViewVisibility(R.id.widget_empty_text, View.VISIBLE)
                        for (rowId in rowIds) {
                            views.setViewVisibility(rowId, View.GONE)
                        }
                    } else {
                        views.setViewVisibility(R.id.widget_empty_text, View.GONE)
                        for (i in 0 until 5) {
                            if (i < itemCount) {
                                val item = items!!.getJSONObject(i)
                                val title = item.optString("title", "Tugas")
                                val isCompleted = item.optBoolean("isCompleted", false)
                                val priority = item.optString("priority", "low").uppercase()

                                views.setViewVisibility(rowIds[i], View.VISIBLE)
                                views.setTextViewText(cbIds[i], if (isCompleted) "☑" else "☐")
                                views.setTextViewText(titleIds[i], title)
                                views.setTextViewText(badgeIds[i], priority)
                            } else {
                                views.setViewVisibility(rowIds[i], View.GONE)
                            }
                        }
                    }
                } catch (e: Exception) {
                    views.setTextViewText(R.id.widget_tv_counter, "0/0")
                    views.setViewVisibility(R.id.widget_empty_text, View.VISIBLE)
                    for (rowId in rowIds) {
                        views.setViewVisibility(rowId, View.GONE)
                    }
                }
            } else {
                views.setTextViewText(R.id.widget_tv_counter, "0/0")
                views.setViewVisibility(R.id.widget_empty_text, View.VISIBLE)
                for (rowId in rowIds) {
                    views.setViewVisibility(rowId, View.GONE)
                }
            }

            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }
}

