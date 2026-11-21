# Glance instantiates action callbacks reflectively in release builds.
-keep class com.deen.widgets.TasbihCountAction { public <init>(); }
-keep class com.deen.widgets.TasbihResetAction { public <init>(); }
