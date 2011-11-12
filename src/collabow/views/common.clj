(ns collabow.views.common
  (:use [noir.core :only [defpartial]]
        [hiccup.core :only [defhtml]]
        [hiccup.page-helpers :only [include-css include-js html5]]))

(def includes {:jquery (include-js "https://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js")
               :jquery-ui (include-js "https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/jquery-ui.min.js")
               :jquery-ink (include-js "/js/jquery-ink.js")
               :reset (include-css "/css/reset.css")
               :style (include-css "/css/style.css")
               :canvas.js (include-js "/js/canvas.js")
               :ink.js (include-js "/js/ink.js")})

(defhtml build-head [incls]
            [:head
             [:title "collabow"]
             (map #(get includes %) incls)])

(defpartial layout [includes & content]
            (html5
              (build-head  (into [:style :jquery :jquery-ui] includes))
              [:body
               [:div#wrapper
                content]]))
