(ns collabow.server
  (:require [noir.server :as server]
            [collabow.models.db :as db]))

(server/load-views "src/collabow/views/")

(defn -main [& m]
  (let [mode (keyword (or (first m) :dev))
        port (Integer. (get (System/getenv) "PORT" "8080"))]
    (db/init-db! (if (= mode :dev) {}  {:url (get (System/getenv) "REDISTOGO_URL")}))
    (server/start port {:mode mode
                        :ns 'collabow})))

