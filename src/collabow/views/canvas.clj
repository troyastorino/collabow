(ns collabow.views.canvas
  (:require [collabow.views.common :as common]
            [collabow.models.db :as db])
  (:use [noir.core :only [defpage]]
        [hiccup.core :only [html]]
        [hiccup.form-helpers :only [form-to hidden-field submit-button]]))

(defpage "/ink" []
  (common/includes-layout
   [:jquery-ink :ink.js]
   [:div#my-ink]
   [:p "Version 0.1 MADesigns"]
   [:button#clear "Clear"]))

(defpage [:post "/ink/store-data"] {:keys [data]}
  (db/set-strokes data))

(defpage "/ink/data" []
  (str (db/get-strokes)))