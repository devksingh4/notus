package main

import (
	"fmt"
	"github.com/Equanox/gotron"
	// "github.com/tidwall/gjson" // can read json nicely
	// "strconv" // clean strings
)


func main() {
	// Create a new browser window instance
	window, err := gotron.New("ui/dist")
	if err != nil {
		panic(err)
	}

	// Alter default window size and window title.
	window.WindowOptions.Width = 1200
	window.WindowOptions.Height = 980
	window.WindowOptions.Title = "Notus"

	// Start the browser window.
	// This will establish a golang <=> nodejs bridge using websockets,
	// to control ElectronBrowserWindow with our window object.
	done, err := window.Start()
	if err != nil {
		panic(err)
	}
	window.On(&gotron.Event{Event: "layout-data"}, func(bin []byte) {
		fmt.Println(string(bin)) // bin is actually an array of bytes for some reason and not a string (of course, thats the most logical way to do this!)
	})
	// Open dev tools must be used after window.Start
	// window.OpenDevTools()

	// Wait for the application to close
	<-done
}
