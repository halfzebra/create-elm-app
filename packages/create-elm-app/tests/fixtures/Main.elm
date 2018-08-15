module Main exposing (..)

import App exposing (..)
import Html.App exposing (program)


main : Program Never
main
    program { view = view, init = init, update = update, subscriptions = subscriptions }
