(ns collabow.views.canvas
  (:require [collabow.views.common :as common])
  (:use [noir.core :only [defpage]]
        [hiccup.core :only [html]]))

(defpage "/canvas" []
  (common/layout
   [:canvas.js]
   [:div#canvasDiv]))

(defpage "/ink" []
  (common/layout [:jquery-ink :ink.js]
   [:div#myInk]))