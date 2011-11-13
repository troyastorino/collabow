(ns collabow.views.canvas
  (:require [collabow.views.common :as common])
  (:use [noir.core :only [defpage]]
        [hiccup.core :only [html]]
        [hiccup.form-helpers :only [form-to text-field submit-button]]))

(defpage "/ink" []
  (common/layout
   [:jquery-ink :ink.js]
   [:div#my-ink]
   [:div#data-form
    (form-to [:post "/ink/data"]
             (text-field "data")
             (submit-button "Submit data"))]))

(defpage [:post "/ink/data"] {:as data}
  [:p data])