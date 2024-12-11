sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/Button",
    "sap/m/ColumnListItem",
    "sap/m/Input",
    "sap/m/Text",
    "sap/m/VBox", // Ensure VBox is imported
    "sap/m/Image" // Ensure Image is imported
], function (Controller, Button, ColumnListItem, Input, Text, VBox, Image) {
    "use strict";

    return Controller.extend("image.controller.View1", {
        onInit: function () {
            this.rowCount = 0; // Counter to track the number of rows
            this.imageMap = {}; // Map to link row numbers with their associated VBox
        },

        // Method to add a new row
        onAddRowPress: function () {
            var oTable = this.byId("dataTable");

            // Increment the row count
            this.rowCount++;

            // Create a new ColumnListItem (row) with cells
            var oRow = new ColumnListItem({
                cells: [
                    // Sr. No. Text
                    new Text({
                        text: this.rowCount
                    }),

                    // Value Input field
                    new Input({
                        placeholder: "Enter value"
                    }),

                    // Upload button
                    new Button({
                        text: "Add Image",
                        press: this.onUploadPress.bind(this, this.rowCount)
                    })
                ]
            });

            // Add the new row to the table
            oTable.addItem(oRow);
        },

        // Handler for the "Add Image" button in each row
        onUploadPress: function (rowNumber) {
            var imageSrc = "images/image001.png"; // Replace with the actual image source
            this.addOrUpdateImage(imageSrc, rowNumber);
            sap.m.MessageToast.show("Image updated for Row " + rowNumber);
        },

        // Method to add or update an image dynamically
        addOrUpdateImage: function (sImageSrc, rowNumber) {
            var oGrid = this.byId("imageGrid");

            if (this.imageMap[rowNumber]) {
                // If VBox already exists, update the image
                var oVBox = this.imageMap[rowNumber];
                var oImage = oVBox.getItems()[1]; // Get the Image control from VBox
                oImage.setSrc(sImageSrc);
            } else {
                // Create Text for Sr. No.
                var oText = new Text({
                    text: "Sr. No. " + rowNumber,
                    textAlign: "Center"
                });

                // Create Image control
                var oImage = new Image({
                    src: sImageSrc,
                    width: "140px",
                    height: "140px"
                });

                // Create a VBox to group Text and Image
                var oVBox = new VBox({
                    items: [oText, oImage],
                    alignItems: "Center"
                });

                // Add the VBox to the Grid
                oGrid.addContent(oVBox);

                // Store the VBox reference in the map with the row number
                this.imageMap[rowNumber] = oVBox;
            }
        },

        // Handler for "Delete Selected Rows" button
        onDeleteSelectedRowsPress: function () {
            var oTable = this.byId("dataTable");
            var oGrid = this.byId("imageGrid");

            // Get selected rows
            var aSelectedItems = oTable.getSelectedItems();

            if (aSelectedItems.length === 0) {
                sap.m.MessageToast.show("No rows selected for deletion.");
                return;
            }

            // Delete rows and associated VBoxes
            aSelectedItems.forEach(function (oItem) {
                // Get the row number from the first cell (Sr. No.)
                var rowNumber = oItem.getCells()[0].getText();

                // Remove the row from the table
                oTable.removeItem(oItem);

                // Remove the corresponding VBox from the grid
                var oVBox = this.imageMap[rowNumber];
                if (oVBox) {
                    oGrid.removeContent(oVBox);
                    delete this.imageMap[rowNumber];
                }
            }.bind(this));

            sap.m.MessageToast.show("Selected rows deleted.");
        }
    });
});
