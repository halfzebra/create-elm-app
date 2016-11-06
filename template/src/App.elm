module App exposing (..)

import Html exposing (Html, text, div)


type alias Model =
    {}


init : ( Model, Cmd Msg )
init =
    ( {}, Cmd.none )


type Msg
    = NoOp


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    ( model, Cmd.none )


view : Model -> Html Msg
view model =
    div [] [ text "Your Elm App is working!" ]


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none
