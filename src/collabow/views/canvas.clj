(ns collabow.views.canvas
  (:require [collabow.views.common :as common])
  (:use [noir.core :only [defpage]]
        [hiccup.core :only [html]]))

(defpage "/ink" []
  (common/layout [:jquery-ink :ink.js]
   [:div#myInk]))