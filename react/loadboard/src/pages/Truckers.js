import React, { useEffect } from "react";
import Navigation from "../components/navbar";
import TableLoad from "../components/tableload";
import TableNotif from "../components/tablenotifs";

function Truckers() {
  useEffect(() => {
    var btn = document.getElementById("button");

    // Get the popup element
    var popup = document.getElementById("myPopup");

    // Get the <span> element that closes the popup
    var closeBtn = document.getElementsByClassName("close-btn")[0];

    // When the user clicks the button, open the popup
    btn.onclick = function () {
      popup.style.display = "block";
    };

    // When the user clicks on <span> (x), close the popup
    closeBtn.onclick = function () {
      popup.style.display = "none";
    };

    // Close the popup if the user clicks anywhere outside of it
    window.onclick = function (event) {
      if (event.target == popup) {
        popup.style.display = "none";
      }
    };

    // Make the DIV element draggable:
    dragElement(document.getElementById("myPopup"));

    function dragElement(element) {
      var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
      if (document.getElementById(element.id + "-header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(element.id + "-header").onmousedown =
          dragMouseDown;
      } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        element.onmousedown = dragMouseDown;
      }

      function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
      }

      function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        element.style.top = element.offsetTop - pos2 + "px";
        element.style.left = element.offsetLeft - pos1 + "px";
      }

      function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
      }
    }
  }, []);

  return (
    <div>
      <div>
        <Navigation color="black" />
      </div>
      <div class="top-background">
        <div>
          <button id="button" class="details-button">
            My Details
          </button>

          <div id="myPopup" class="popup">
            <div class="popup-content">
              <span class="close-btn">&times;</span>

              <div class="mydetails">
                <table class="table-details">
                  <tr>
                    <th class="vehicle-info-name">Vehicle Type:</th>
                    <td class="vehicle-info-info">*type*</td>
                  </tr>
                  <tr>
                    <th class="vehicle-info-name">Vehicle ID:</th>
                    <td class="vehicle-info-info">*id*</td>
                  </tr>
                  <tr>
                    <th class="vehicle-info-name">Trip Length:</th>
                    <td class="vehicle-info-info">*length*</td>
                  </tr>
                  <tr>
                    <th class="vehicle-info-name">Position:</th>
                    <td class="vehicle-info-info">*Lat pos, Long pos*</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div class="border-top"></div>
      </div>

      <div class="available-loads">
        <TableLoad></TableLoad>
      </div>

      <div class="notifications">
        <TableNotif/>
      </div>
    </div>
  );
}

export default Truckers;
