(defproject collabow "0.1.0-SNAPSHOT"
            :description "realtime remote collaboration web client"
            :dependencies [[org.clojure/clojure "1.3.0"]
                           [noir "1.2.1"]
                           [clj-redis "0.0.12"]
                           [org.clojure/data.json "0.1.1"]]
            :main collabow.server)

