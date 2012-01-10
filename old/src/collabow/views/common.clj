(ns collabow.views.common
  (:use [noir.core :only [defpartial]]
        [hiccup.core :only [defhtml]]
        [hiccup.page-helpers :only [include-css include-js html5]]
        [h5bp-clj.core]))

(def includes {:jquery (include-js "https://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js")
               :jquery-ui (include-js "https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/jquery-ui.min.js")
               :jquery-ink (include-js "/lib/jquery-ink.js")
               :detect (include-js "/lib/detectmobilebrowser.js")
               :reset (include-css "/css/reset.css")
               :style (include-css "/css/styleV3.css")
               :landing (include-css "/css/styleLanding.css")
               :util.js (include-js "/js/util.js")
               :ink.js (include-js "/js/ink.js")
               :welcome.js (include-js "/js/welcome.js")})

(defhtml build-head [incls]
            [:head
             [:title "collabow"]
             [:link {:rel "icon" :href "/img/faviconBlue.ico"}]
             (map #(get includes %) incls)])

(defhtml header []
  [:header
   [:h1 [:a {:href "/"} [:img#logo {:src "/img/logo4.png" :alt "logo"}]]]
   [:h3#tagline "brainstorm real-time with anyone anywhere."]])

(defhtml footer []
  [:footer [:p#version "&#8226;&#8226;&#8226; Version 0.0.1alpha3 MADesigns &#8226;&#8226;&#8226"]])

(defhtml includes-layout [includes & content]
            (html5
              (build-head  (into [:style :jquery :jquery-ui :detect :util.js] includes))
              [:body
               (header)
               [:div#wrapper
                content]
               (footer)]))

(defhtml layout [& content]
  (includes-layout [] content))


(defhtml test-layout [includes & content]
  (h5bp
   {:title "Collabow"
    :description "Brainstorm real-time with anyone anywhere."
    :author "MADesigns"
    :goog-site-id "UA-27532955-1"
    :jquery-path "lib/jquery-1.7.min.js"}
   (header)
   [:div#wrapper
    content]
   (footer)))