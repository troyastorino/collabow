(ns collabow.views.welcome
  (:require [collabow.views.common :as common]
            [collabow.models.strokes :as strokes]
            [clojure.string :as str])
  (:use [noir.core :only [defpage]]
        [hiccup.core :only [html defhtml]]
        [hiccup.form-helpers :only [form-to text-field submit-button]]))

(defpage "/" []
  (html
   (common/build-head [:landing :welcome.js])
   [:div#wrapper
    [:img#circle.center {:src "/img/landing.png" :alt "circle and logo"}]
    [:div#instructions.center
     [:form#nameyourspace.center
      [:input#spaceid.center {:type "text" :name "spaceid"}]
      [:input#go.center {:type "image" :src "/img/gobutton.png" :alt "let's go collabow!"}]]
     [:p#start "Collabow is a real-time remote collaboration platform. This means that you can have a virtual space that you can share with anyone anytime, and you can all work at the same time. To get started, chose a name for your space and enter it here:"]
     [:img#pointright {:src "/img/arrowright.png" :alt "pointing right"}]
     [:img#pointleft {:src "/img/arrowleft.png" :alt "pointing left"}]
     [:p#ready "Now, you can share your space name with anyone you want to Collabow-rate with. Share it with friends, co-workers, or anyone else you want to exchange ideas with. Ready, set, let's go Collabow!"]]]))