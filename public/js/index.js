$(document).ready(function () {
  var myTable = $('#dataTable').DataTable({
    // replace: true,
    // select: true,
    // scrollCollapse: true,
    // fixedColumns: true,
    responsive: true,
    // pageLength: 15,
    // info: false,
    lengthChange: false,
    paging: false,
    scrollY: "650px",
    language: {
      decimal: "",
      emptyTable: "該当データがありません",
      info: " _START_ - _END_ / 全 _TOTAL_ 件",
      infoEmpty: "0件",
      infoFiltered: "(全_MAX_件)",
      infoPostFix: "",
      thousands: ",",
      lengthMenu: " _MENU_ 件ごと",
      loadingRecords: "Loading...",
      processing: "Processing...",
      search: "一覧絞り込み：",
      searchPlaceholder: "絞り込む文字列を入力",
      zeroRecords: "該当データがありません",
      paginate: {
        first: "&lsaquo;",
        last: "&rsaquo;",
        next: "&raquo;",
        previous: "&laquo;",
      },
    },
    order: [3, "asc"],
    columnDefs: [
      { targets: "table-name", data:"tableNo",  width: "9%" },
      { targets: "dish-name", data:"ordered_titles", width: "48%" },
      { targets: "quantity", data:"ordered_quantities", width: "9%" },
      { targets: "ordered-time", data:"ordered_at", width: "12%"},
      // { targets: "size", width: "10%", className: "column-middle" },
      // { targets: "ordered-time", width: "20%" },
      { targets: "transaction-id", data: "transactionId", className: "hiddenData" },
      { targets: "order-no", data: "order_no", className: "hiddenData" },
      {
        targets: "make-btn",
        className: "column-middle",
        width: "6%",
        orderable: false,
        searchable: false,
        data: "cooked_status",
        defaultContent: "",
        // render: function () {
        //   return (
        //     '<button type="button" value="Submit" class="btn btn-primary make-button" id="make_btn" data-toggle="modal" data-target="#">OK</button>'
        //   );
        // },
      },
      {
        targets: "take-btn",
        className: "column-middle",
        width: "5%",
        orderable: false,
        searchable: false,
        data: "take_status",
        defaultContent: "",
        // render: function () {
        //   return (
        //     '<button type="button" value="Submit" class="btn btn-primary take-button" id="take_btn" data-toggle="modal" data-target="#">OK</button>'
        //   );
        // },
      },
      {
        targets: "placed-btn",
        className: "column-middle",
        width: "5%",
        orderable: false,
        searchable: false,
        data: "placed_status",
        defaultContent: "",
        // render: function () {
        //   return (
        //     '<button type="button" value="Submit" class="btn btn-primary placed-button" id="placed_btn" data-toggle="modal" data-target="#">OK</button>'
        //   );
        // },
      },
      {
        targets: "delete-btn",
        className: "column-middle",
        width: "7%",
        orderable: false,
        searchable: false,
        data: "deleted_status",
        defaultContent: "",
        // render: function () {
        //   return (
        //     '<button type="button" value="Submit" class="btn btn-danger delete-button" id="delete_btn" data-toggle="modal" data-target="#">削除</button>'
        //   );
        // },
      }
    ],
    rowCallback: function (row, data, index) {
      // after cooked status
      if (data["cooked_status"] == 1) {
        $("td:eq(4)", row).html('<button type="button" class="btn btn-primary make-button" id="make_btn" disabled="disabled">OK</button>')
      }
      else {
        $("td:eq(4)", row).html('<button type="button" class="btn btn-primary make-button" id="make_btn" data-toggle="modal" data-target="#">OK</button>')
      }
      // after take status
      if (data["take_status"] == 1) {
        $("td:eq(5)", row).html('<button type="button" class="btn btn-primary take-button" id="take_btn" disabled="disabled">OK</button>')
      }
      else {
        $("td:eq(5)", row).html('<button type="button" class="btn btn-primary take-button" id="take_btn" data-toggle="modal" data-target="#">OK</button>')
      }
      // after placed status
      if (data["placed_status"] == 1) {
        $("td:eq(6)", row).html('<button type="button" class="btn btn-primary placed-button" id="placed_btn" disabled="disabled">OK</button>')
      }
      else {
        $("td:eq(6)", row).html('<button type="button" class="btn btn-primary placed-button" id="placed_btn" data-toggle="modal" data-target="#">OK</button>')
      }
      // after delete status
      if (data["deleted_status"] == 1) {
        $("td:eq(7)", row).html('<button type="button" class="btn btn-danger delete-button" id="delete_btn" disabled="disabled">削除</button>')
      }
      else {
        $("td:eq(7)", row).html('<button type="button" class="btn btn-danger delete-button" id="delete_btn" data-toggle="modal" data-target="#">削除</button>')
      }
    },
  });

  // get order data
  fetch('/SelectOrder', { method: 'GET' })
    .then(function (response) {
      if (response.ok) return response.json();
      throw new Error('Request failed.');
    })
    .then(function (data) {
      data.forEach(transaction => {
        console.log(transaction)
        var rowNode = myTable.row.add({
          "tableNo": `${transaction.order.table_no}`,
          "ordered_at": `${transaction.order.ordered_at}`,
          "order_no": `${transaction.order.order_no}`,
          "cooked_status": `${transaction.order.cooked_status}`,
          "take_status": `${transaction.order.take_status}`,
          "placed_status": `${transaction.order.placed_status}`,
          "deleted_status": `${transaction.order.deleted_status}`,
          "ordered_quantities": `${transaction.order.ordered_quantities}`,
          "ordered_titles": `${transaction.order.ordered_titles}`,
          "transactionId": `${transaction._id}`,
        }).draw();
      });
    })
    .catch(function (error) {
      console.log(error);
    });

  $('#dataTable tbody').on('click', '#make_btn, #take_btn, #placed_btn, #delete_btn', function() {
    $(this).parents('tr').toggleClass("selected")
        .siblings(".selected")
        .removeClass("selected");
    var data = myTable.row($(this).parents('tr')).data();
    console.log(data);
  })
  $("thead tr").css("border-bottom","5px solid #000");
  $(".dataTables_wrapper .row:first-child>div:first-child").append($("#dataTable_info"));
});