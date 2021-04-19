function draw_table()
{
	$("#results").empty();
	$.getJSONuncached = function (url)
	{
		return $.ajax( //it does the ajax request to the end point that we created 
		{
			url: url,
			type: 'GET',
			cache: false,
			success: function (html)
			{
				$("#results").append(html); 
				select_row(); // this function allow us to click in any row and i would highlight that row
			}
		});
	};
	$.getJSONuncached("/get/html")
};

function select_row() // the highlight row it's been selected and it grabs 2 variables: section and entree
{
	$("#menuTable tbody tr[id]").click(function ()
	{
		$(".selected").removeClass("selected");//the row is selected
		$(this).addClass("selected");
		var section = $(this).prevAll("tr").children("td[colspan='3']").length - 1;
		var entree = $(this).attr("id") - 1; // the enrtee comes from the id
		delete_row(section, entree);
	})
};

function delete_row(sec, ent)
{
	$("#delete").click(function () //the funtion gets trigger when we click the delete button
	{
		$.ajax(
		{
			url: "/post/delete",
			type: "POST",
			data:
			{
				section: sec,
				entree: ent
			},
			cache: false,
			success: setTimeout(draw_table, 1000)
		})
	})
};
//this last function says, trigger the draw table when the page goes
$(document).ready(function ()
{
	draw_table();
});