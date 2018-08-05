module Main exposing (..)

import Html exposing (Html, node, text, div, h1, img)
import Html.Attributes exposing (src)
import Html.Events exposing (on, onClick)
import Json.Decode exposing (Decoder)


---- MODEL ----


type alias Model =
    {}


init : ( Model, Cmd Msg )
init =
    ( {}, Cmd.none )



---- UPDATE ----


type Msg
    = CustomMsg Int


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    Debug.log "Message: " msg
        |> \_ ->
            ( model, Cmd.none )



---- VIEW ----

decoder : Decoder Int
decoder = 
    Json.Decode.at [ "detail", "times" ] Json.Decode.int

view : Model -> Html Msg
view model =
    div []
        [ img [ src "/logo.svg" ] []
        , h1 [] [ text "Your Elm App is working!" ]
        , node "hello-world"
            [ on "boom" (Json.Decode.map CustomMsg decoder)
            ]
            []
        ]



---- PROGRAM ----


main : Program Never Model Msg
main =
    Html.program
        { view = view
        , init = init
        , update = update
        , subscriptions = always Sub.none
        }
