module App exposing (..)

import Html exposing (Html, text, div)


type alias Model =
    { message : String
    }


init : ( Model, Cmd Msg )
init =
    ( { message = "Your Elm App is working!" }, Cmd.none )


type Msg
    = NoOp


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    ( model, Cmd.none )


view : Model -> Html Msg
view model =
    div [] [ text model.message ]


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none
