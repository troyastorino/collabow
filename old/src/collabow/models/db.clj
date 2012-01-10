(ns collabow.models.db
  (:require [clj-redis.client :as redis]))

(defn init-db! [{:keys [url]}]
  (def db (redis/init {:url url})))

(defn add-stroke!
  ([s] (redis/sadd db "strokes-set" s))
  ([id s] (redis/sadd db (str "strokes-set:" id) s)))

(defn rm-stroke!
  ([s] (redis/srem db "strokes-set" s))
  ([id s] (redis/srem db (str "strokes-set:" id) s)))

(defn get-strokes-set
  ([] (redis/smembers db "strokes-set"))
  ([id] (redis/smembers db (str "strokes-set:" id))))

(defn clear-strokes-set
  ([] (redis/del db ["strokes-set"]))
  ([id] (redis/del db [(str "strokes-set:" id)])))

(defn set-strokes [strokes]
  (redis/set db "strokes" strokes))

(defn get-strokes []
  (redis/get db "strokes"))
