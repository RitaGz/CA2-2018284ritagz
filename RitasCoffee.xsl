<?xml version="1.0" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:template match="/">
        <html>
            <head>
                <title>Rita's Coffee</title>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                <link rel="stylesheet" href="css/RitasCoffee.css"></link>
                <script type="text/javascript" src="js/RitasCoffee.js">x</script>
            </head>
            <body>
                <p>
                    <ul>
                        <li>Select your entrees from the menu below.</li>
                        <li>To calculate the amount of the bill, select the items you wish and click the Calculate Bill button.</li>
                        <li>Check the "Highlight Vegetarian Options" box to highlight vegetarian choices.</li>
                        <li>If you want to add a new item, select the entry, then write a new name and new price, then clickthe Green button "Submit".</li>
                        <li>If you want to delete an item, select the row you want to delete, then press the red button "Delete".</li>
                    </ul>
                </p>
                <table id="menuTable" border="1" class="indent">
                    <thead>
                        <tr>
                            <th colspan="3">Rita's Coffee Menu</th>
                        </tr>
                        <tr>
                            <th>Select</th>
                            <th>Product</th>
                            <th>Price € </th>
                        </tr>
                    </thead>
                    <tbody>
                        <xsl:for-each select="/cafemenu/section">
                            <tr>
                                <td colspan="3">
                                    <xsl:value-of select="@name" />
                                </td>
                            </tr>
                            <xsl:for-each select="entree">
                                <!-- this next function gives us the position of the entree, we can grab the item by its ID -->
                                <tr id="{position()}"> 
                                    <xsl:attribute name="vegetarian">
                                        <xsl:value-of select="boolean(@vegetarian)" />
                                    </xsl:attribute>
                                    <td align="center">
                                        <input name="item0" type="checkbox" />
                                    </td>
                                    <td>
                                        <xsl:value-of select="item" />
                                    </td>
                                    <td align="right">
                                        <xsl:value-of select="price" />
                                    </td>
                                </tr>
                            </xsl:for-each>
                        </xsl:for-each>
                    </tbody>
                </table>
                <!-- <form class="indent">
                    <p>
                        <input type="button" name="btnCalcBill" value="Calculate Bill" id="calcBill" />
                        Total: €
                        <input type="text" name="txtBillAmt" />
                        <input type="checkbox" name="cbOpts" value="isVeg" id="showVeg" />
                        <label for="showVeg">Highlight Vegetarian Options</label>
                    </p>
                </form> -->
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>