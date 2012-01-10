(ns collabow.views.canvas
  (:require [collabow.views.common :as common]
            [collabow.models.db :as db]
            [collabow.models.strokes :as strokes]
            [clojure.data.json :as json])
  (:use [noir.core :only [defpage]]
        [hiccup.core :only [html defhtml]]
        [hiccup.form-helpers :only [form-to hidden-field submit-button]]))

(defhtml canvas []
  (common/includes-layout   [:jquery-ink :ink.js]
   [:img#arrow {:src "/img/arrowBlue.png" :alt "Start sketching!"}]
   [:div#tools
    [:img#draw-selected.button {:src "/img/drawBlue.png" :alt "Currently in sketch mode"}]
    [:img#draw.button.hidden {:src "/img/drawOrange.png" :alt "Draw"}]
    [:img#erase.button {:src "/img/eraseOrange.png" :alt "Erase"}]
    [:img#erase-selected.button.hidden {:src "/img/eraseBlue.png" :alt "Currently in erase mode"}]
    [:img#clear.button {:src "/img/eraseallOrange.png" :alt "Erase All"}]
    [:img#clear-selected.button.hidden {:src "/img/eraseallBlue.png" :alt "Erase All selected"}]]
   [:div#my-ink]))

(defpage "/ink" []
  (canvas))

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
  (do
    (str (db/rm-stroke! data))))

(defpage "/ink/strokes" []
  (json/json-str (vec (db/get-strokes-set))))

(defpage [:post "/ink/clear-strokes"] []
  (str (db/clear-strokes-set)))

;; With individual pages

(defpage "/canvas/:id" {:keys [id]}
  (canvas))

(defpage "/canvas/strokes/:id" {:keys [id]}
  (json/json-str (vec (db/get-strokes-set id))))

(defpage [:post "/canvas/add-stroke/:id"] {:keys [id data]}
  (let [ret (str (db/add-stroke! id data))]
    (println "id: " id " data: " data " ret: " ret)
    ret))

(defpage [:post "/canvas/remove-stroke/:id"] {:keys [id data]}
  (str (db/rm-stroke! id data)))

(defpage [:post "/canvas/clear-strokes/:id"] {:keys [id data]}
  (str (db/clear-strokes-set id)))