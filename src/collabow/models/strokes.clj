(ns collabow.models.strokes
  (:require [collabow.models.db :as db]))

(defn str->seq [s]
  (re-seq #"\([^\(\)]+\)" s))

(defn str->set [s]
  (set (str->seq s)))

(defn seq->str [coll]
  (apply str coll))

