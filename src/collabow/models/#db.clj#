(ns collabow.models.db
  (:require [clj-redis.client :as redis])
  (:import java.net.URI))

(defn init-db!
  ([{:keys [url]}] (def db (redis/init {:url url}))))

(defn set-strokes [strokes]
  (redis/set db "strokes" strokes))

(defn get-strokes []
  (redis/get db "strokes"))