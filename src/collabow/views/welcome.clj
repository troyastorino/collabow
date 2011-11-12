(ns collabow.views.welcome
  (:require [collabow.views.common :as common]
            [noir.content.getting-started])
  (:use [noir.core :only [defpage]]
        [hiccup.core :only [html]]))

(defpage "/welcome" []
  (common/layout
   [:p "Welcome to collabow"]))
