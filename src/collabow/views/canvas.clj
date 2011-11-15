(ns collabow.views.canvas
  (:require [collabow.views.common :as common]
            [collabow.models.db :as db])
  (:use [noir.core :only [defpage]]
        [hiccup.core :only [html]]
        [hiccup.form-helpers :only [form-to hidden-field submit-button]]))

(defpage "/ink" []
  (common/includes-layout
   [:jquery-ink :ink.js]
   [:img#arrow {:src "/img/arrow.png" :alt "Start sketching!"}]
   [:div#tools
    [:button#pencil "Sketch"]
    [:button#eraser "Erase"]
    [:button#clear "Clear"]]
   [:div#my-ink]))

(defpage [:post "/ink/store-data"] {:keys [data]}
  (do
    (db/set-strokes data)
    (let [strokes (db/get-strokes)]
      strokes)))

(defpage "/ink/data" []
  (str (db/get-strokes)))