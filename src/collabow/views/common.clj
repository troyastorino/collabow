(ns collabow.views.common
  (:use [noir.core :only [defpartial]]
        [hiccup.core :only [defhtml]]
        [hiccup.page-helpers :only [include-css include-js html5]]))

(def includes {:jquery (include-js "https://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js")
               :jquery-ui (include-js "https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/jquery-ui.min.js")
               :jquery-ink (include-js "/lib/jquery-ink.js")
               :reset (include-css "/css/reset.css")
               :style (include-css "/css/style.css")
               :canvas.js (include-js "/js/canvas.js")
               :ink.js (include-js "/js/ink.js")})

(defhtml build-head [incls]
            [:head
             [:title "collabow"]
             [:link {:rel "icon" :href "/img/favicon.ico"}]
             (map #(get includes %) incls)])

(defhtml header []
  [:header [:h1 [:img#logo {:src "/img/collogo.png" :alt "logo"}]]])

(defhtml footer []
  [:footer [:p "Version 0.1 MADesigns"]])

(defhtml includes-layout [includes & content]
            (html5
              (build-head  (into [:style :jquery :jquery-ui] includes))
              [:body
               (header)
               [:div#wrapper
                content]
               (footer)]))

(defhtml layout [content]
  (includes-layout [] content))
