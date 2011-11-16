(ns collabow.models.db
  (:require [clj-redis.client :as redis]))

(defn init-db! [{:keys [url]}]
  (def db (redis/init {:url url})))

(defn add-stroke! [s]
  (redis/sadd db "strokes-set" s))

(defn rm-stroke! [s]
  (redis/srem db "strokes-set" s))

(defn get-strokes-set []
  (redis/smembers db "strokes-set"))

(defn clear-strokes-set []
  (redis/del db ["strokes-set"]))

(defn set-strokes [strokes]
  (redis/set db "strokes" strokes))

(defn get-strokes []
  (redis/get db "strokes"))