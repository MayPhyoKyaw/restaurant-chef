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
    order: [4, "asc"],
    columnDefs: [
      { targets: "table-name", width: "10%" },
      { targets: "menu-name", width: "40%" },
      { targets: "quantity", width: "10%", className: "column-middle" },
      { targets: "size", width: "10%", className: "column-middle" },
      { targets: "ordered-time", width: "20%" },
      {
        targets: "action-btn",
        className: "column-middle",
        width: "10%",
        orderable: false,
        searchable: false,
        data: null,
        defaultContent: "",
        render: function () {
          return (
            // '<a href="#" value="Submit" id="submit_btn" class="btn btn-primay submit-button" data-row-id="0" data-toggle="modal" data-target="">OK</a>'
            '<button type="button" value="Submit" class="btn btn-primary submit-button" id="submit_btn" data-toggle="modal" data-target="#">OK</button>'
          );
        },
      }
    ],
  });
  $('#dataTable tbody').on('click', '#submit_btn', function() {
    $(this).parents('tr').toggleClass("selected")
        .siblings(".selected")
        .removeClass("selected");
    var data = myTable.row($(this).parents('tr')).data();
    console.log(data);
  })

  $(".dataTables_wrapper .row:first-child>div:first-child").append($("#dataTable_info"));
});