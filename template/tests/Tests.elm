module Tests exposing (..)

import Test exposing (..)
import Expect
import String
import App


all : Test
all =
    describe "A Test Suite"
        [ test "App.model.message should be set properly" <|
            \() ->
                (Tuple.first (App.init  "../src/logo.svg") |> .message)
                    |> Expect.equal "Your Elm App is working!"
        , test "Addition" <|
            \() ->
                Expect.equal 10 (3 + 7)
        , test "String.left" <|
            \() ->
                Expect.equal "a" (String.left 1 "abcdefg")
        , test "This test should fail" <|
            \() ->
                Expect.fail "failed as expected!"
        ]
