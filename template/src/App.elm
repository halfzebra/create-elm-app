module App exposing (..)

import Html exposing (text, div)


subscriptions model =
    Sub.none


update msg model =
    ( model, Cmd.none )


init =
    ( (), Cmd.none )


view model =
    div [] [ text "Your Elm App is working!" ]
