(ns collabow.views.canvas
  (:require [collabow.views.common :as common]
            [collabow.models.db :as db]
            [collabow.models.strokes :as strokes]
            [clojure.data.json :as json])
  (:use [noir.core :only [defpage]]
        [hiccup.core :only [html]]
        [hiccup.form-helpers :only [form-to hidden-field submit-button]]))

(defpage "/ink" []
  (common/includes-layout
   [:jquery-ink :ink.js]
   [:img#arrow {:src "/img/arrow.png" :alt "Start sketching!"}]
   [:div#tools
    [:img#pencil-selected.button {:src "img/pencilSELECT.png" :alt "Currently in sketch mode"}]
    [:img#eraser.button {:src "img/eraser.png" :alt "Erase"}]
    [:img#clear.button {:src "img/eraseall.png" :alt "Erase All"}]]
   [:div#my-ink]))

(defpage [:post "/ink/store-data"] {:keys [data]}
  (do
    (db/set-strokes data)
    (let [strokes (db/get-strokes)]
      strokes)))

(defpage "/ink/data" []
  (str (db/get-strokes)))

(defpage [:post "/ink/add-stroke"] {:keys [data]}
  (str (db/add-stroke! data)))

(defpage [:post "/ink/remove-stroke"] {:keys [data]}
  (str (db/rm-stroke! data)))

(defpage "/ink/strokes" []
  (json/json-str (vec (db/get-strokes-set))))

(defpage [:post "/ink/clear-strokes"] []
  (str (db/clear-strokes-set)))