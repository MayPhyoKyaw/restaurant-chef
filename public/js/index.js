$(document).ready(function () {
  var myTable = $('#dataTable').DataTable({
    // replace: true,
    // select: true,
    // scrollCollapse: true,
    // fixedColumns: true,
    responsive: true,
    // pageLength: 8,
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
      { targets: "table-name", data: "tableNo", width: "9%" },
      {
        targets: "dish-name",
        data: "ordered_titles",
        width: "48%",
        defaultContent: "",
        render: function (data, type, row) {
          return (data.split(",").join("\n").replace(/\s/g, '</br>'));
        },
      },
      {
        targets: "quantity",
        data: "ordered_quantities",
        width: "9%",
        defaultContent: "",
        render: function (data, type, row) {
          return (data.split(",").join("\n").replace(/\s/g, '</br>'));
        },
      },
      { targets: "ordered-time", data: "ordered_at", width: "12%" },
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
      },
      {
        targets: "take-btn",
        className: "column-middle",
        width: "5%",
        orderable: false,
        searchable: false,
        data: "take_status",
        defaultContent: "",
      },
      {
        targets: "placed-btn",
        className: "column-middle",
        width: "5%",
        orderable: false,
        searchable: false,
        data: "placed_status",
        defaultContent: "",
      },
      {
        targets: "delete-btn",
        className: "column-middle",
        width: "7%",
        orderable: false,
        searchable: false,
        data: "deleted_status",
        defaultContent: "",
      },
    ],
    rowCallback: function (row, data, index) {
      // after cooked status
      if (data["cooked_status"] == 1) {
        $("td:eq(4)", row).html('<button type="button" class="btn btn-primary make-button" id="make_btn" disabled="disabled">OK</button>')
      }
      else {
        $("td:eq(4)", row).html('<button type="button" class="btn btn-primary make-button" id="make_btn" data-toggle="modal" data-target="#makeModalConfirmation">OK</button>')
      }
      // after take status
      if (data["take_status"] == 1) {
        $("td:eq(5)", row).html('<button type="button" class="btn btn-primary take-button" id="take_btn" disabled="disabled">OK</button>')
      }
      else {
        $("td:eq(5)", row).html('<button type="button" class="btn btn-primary take-button" id="take_btn" data-toggle="modal" data-target="#takeModalConfirmation">OK</button>')
      }
      // after placed status
      if (data["placed_status"] == 1) {
        $("td:eq(6)", row).html('<button type="button" class="btn btn-primary placed-button" id="placed_btn" disabled="disabled">OK</button>')
      }
      else {
        $("td:eq(6)", row).html('<button type="button" class="btn btn-primary placed-button" id="placed_btn" data-toggle="modal" data-target="#placeModalConfirmation">OK</button>')
      }
      // after delete status
      if (data["deleted_status"] == 1) {
        $("td:eq(7)", row).html('<button type="button" class="btn btn-danger delete-button" id="delete_btn" disabled="disabled">削除</button>')
      }
      else {
        $("td:eq(7)", row).html('<button type="button" class="btn btn-danger delete-button" id="delete_btn" data-toggle="modal" data-target="#deleteModalConfirmation">削除</button>')
      }
      // quantities into list
      // console.log(data["ordered_quantities"])
      console.log($(row).find('td:eq(2)').html())
    },
  });

  // get order data
  fetch('/SelectOrder', { method: 'GET' })
    .then(function (response) {
      if (response.ok) return response.json();
      throw new Error('Request failed.');
    })
    .then(function (data) {
      console.log(data, typeof(data))
      var orders = [];
      data.forEach(transaction => {
        // console.log(transaction);
        orders = transaction.orders;
        // console.log(orders.ordered_titles)
        console.log(typeof(orders));
        // var keys = Object.keys(orders),
        for (var key in orders){
          if (orders.hasOwnProperty(key)){
            // console.log(transaction._id, key, orders[key])
            var order = orders[key];
            console.log(order.ordered_no)
            var rowNode = myTable.row.add({
              "tableNo": `${order.table_no}`,
              "ordered_at": `${order.ordered_at}`,
              "order_no": `${order.ordered_no}`,
              "cooked_status": `${order.cooked_status}`,
              "take_status": `${order.take_status}`,
              "placed_status": `${order.placed_status}`,
              "deleted_status": `${order.deleted_status}`,
              "ordered_quantities": `${order.ordered_quantities}`,
              "ordered_titles": `${order.ordered_titles}`,
              "transactionId": `${transaction._id}`,
            }).draw();
          }
        }
      });
    })
    .catch(function (error) {
      console.log(error);
    });

  // for make status
  $('#dataTable tbody').on('click', '#make_btn', function () {
    $(this).parents('tr').toggleClass("selected")
      .siblings(".selected")
      .removeClass("selected");
    var data = myTable.row($(this).parents('tr')).data();
    console.log(data.transactionId, data);

    var button = document.getElementById('maked-btn');
    button.addEventListener('click', function (e) {
      fetch('/SelectOrder/MakeStatus', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        transaction_id: data.transactionId,
        cooked_status: data.cooked_status,
        deleted_status: data.deleted_status,
        order_no: data.order_no,
        ordered_at: data.ordered_at,
        ordered_quantities: data.ordered_quantities,
        ordered_titles: data.ordered_titles,
        placed_status: data.placed_status,
        tableNo: data.tableNo,
        take_status: data.take_status,
      })
    })
      .then(function (response) {
        console.log(response)
        if (response.ok) {
          console.log('clicked!!');
          return;
        }
        throw new Error('Failed!!');
      })
      .catch(function (error) {
        console.log(error);
      });
      location.reload();
    })
  })

  // for take status
  $('#dataTable tbody').on('click', '#take_btn', function () {
    $(this).parents('tr').toggleClass("selected")
      .siblings(".selected")
      .removeClass("selected");
    var data = myTable.row($(this).parents('tr')).data();
    console.log(data);

    var button = document.getElementById('taked-btn');
    button.addEventListener('click', function (e) {
      fetch('/SelectOrder/TakeStatus', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          transaction_id: data.transactionId,
          cooked_status: data.cooked_status,
          deleted_status: data.deleted_status,
          order_no: data.order_no,
          ordered_at: data.ordered_at,
          ordered_quantities: data.ordered_quantities,
          ordered_titles: data.ordered_titles,
          placed_status: data.placed_status,
          tableNo: data.tableNo,
          take_status: data.take_status,
        })
      })
        .then(function (response) {
          console.log(response)
          if (response.ok) {
            console.log('clicked!!');
            return;
          }
          throw new Error('Failed!!');
        })
        .catch(function (error) {
          console.log(error);
        });
        location.reload();
    })
  })

  // for placed status
  $('#dataTable tbody').on('click', '#placed_btn', function () {
    $(this).parents('tr').toggleClass("selected")
      .siblings(".selected")
      .removeClass("selected");
    var data = myTable.row($(this).parents('tr')).data();
    console.log(data);

    var button = document.getElementById('placed-btn');
    button.addEventListener('click', function (e) {
      fetch('/SelectOrder/PlaceStatus', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          transaction_id: data.transactionId,
          cooked_status: data.cooked_status,
          deleted_status: data.deleted_status,
          order_no: data.order_no,
          ordered_at: data.ordered_at,
          ordered_quantities: data.ordered_quantities,
          ordered_titles: data.ordered_titles,
          placed_status: data.placed_status,
          tableNo: data.tableNo,
          take_status: data.take_status,
        })
      })
        .then(function (response) {
          console.log(response)
          if (response.ok) {
            console.log('clicked!!');
            return;
          }
          throw new Error('Failed!!');
        })
        .catch(function (error) {
          console.log(error);
        });
        location.reload();
    })
  })

  // for delete status
  $('#dataTable tbody').on('click', '#delete_btn', function () {
    $(this).parents('tr').toggleClass("selected")
      .siblings(".selected")
      .removeClass("selected");
    var data = myTable.row($(this).parents('tr')).data();
    console.log(data);

    var button = document.getElementById('deleted-btn');
    button.addEventListener('click', function (e) {
      fetch('/SelectOrder/DeleteStatus', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          transaction_id: data.transactionId,
          cooked_status: data.cooked_status,
          deleted_status: data.deleted_status,
          order_no: data.order_no,
          ordered_at: data.ordered_at,
          ordered_quantities: data.ordered_quantities,
          ordered_titles: data.ordered_titles,
          placed_status: data.placed_status,
          tableNo: data.tableNo,
          take_status: data.take_status,
        })
      })
        .then(function (response) {
          console.log(response)
          if (response.ok) {
            console.log('clicked!!');
            return;
          }
          throw new Error('Failed!!');
        })
        .catch(function (error) {
          console.log(error);
        });
        location.reload();
    })
  })

  $(".dataTables_wrapper .row:first-child>div:first-child").append($("#dataTable_info"));
});