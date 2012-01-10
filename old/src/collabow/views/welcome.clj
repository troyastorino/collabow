(ns collabow.views.welcome
  (:require [collabow.views.common :as common]
            [collabow.models.strokes :as strokes]
            [clojure.string :as str])
  (:use [noir.core :only [defpage]]
        [hiccup.core :only [html defhtml]]
        [hiccup.form-helpers :only [form-to text-field submit-button]]))

(defpage "/" []
  (html
   (common/build-head [:style :jquery :jquery-ui :util.js :landing :welcome.js])
   [:div#wrapper
    [:img#circle.center {:src "/img/landing.png" :alt "circle and logo"}]
    [:div#instructions.center
     [:p#start "Collabow is a real-time remote collaboration platform. This means you get a virtual space to share with anyone, and you can all work on it at the same time. To get started, choose a name for your space."]
     [:img#pointright {:src "/img/arrowright.png" :alt "pointing right"}]
     [:form#nameyourspace
      [:input#spaceid.center {:type "text" :name "spaceid"}]
      [:input#go.center {:type "image" :src "/img/gobutton.png" :alt "let's go collabow!"}]]     
     [:img#pointleft {:src "/img/arrowleft.png" :alt "pointing left"}]
     [:p#ready "Now, share this space with anyone you want to Collabow-rate with. Use it with friends, co-workers, and anyone else you want to exchange ideas with. Give them the name, and you're golden!  Ready, set, Collabow!"]]]))