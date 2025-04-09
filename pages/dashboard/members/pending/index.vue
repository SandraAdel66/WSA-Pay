<template>
  <Breadcrumb
    title="Pending"
    :items="[{ label: 'list of pending members', to: '/members/pending' }]"
  />

  <section id="basic-datatable">
    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-between mb-1">
                <div class="">
                  <div class="" id="">
                    <label
                      >Show
                      <select name="" aria-controls="" class="form-control">
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                      </select>
                    </label>
                  </div>
                </div>
                <div class="">
                  <div id="" class="">
                    <label
                      >Search:<input
                        type="search"
                        class="form-control"
                        placeholder=""
                        aria-controls=""
                    /></label>
                  </div>
                </div>
              </div>

        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Zero configuration</h4>
          </div>
          <div class="card-content">
            <div class="card-body card-dashboard">
             
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Position</th>
                      <th>Office</th>
                      <th>Age</th>
                      <th>Start date</th>
                      <th>Salary</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Tiger Nixon</td>
                      <td>System Architect</td>
                      <td>Edinburgh</td>
                      <td>61</td>
                      <td>2011/04/25</td>
                      <td>$320,800</td>
                    </tr>
                  </tbody>
                </table>
              </div>
          
            </div>
          </div>
        </div>
        <div class="d-flex justify-content-between">
                <div class="">
                  <div class="" id="" role="status" aria-live="polite">
                    Showing 1 to 10 of 29 entries
                  </div>
                </div>
                <div class="">
                  <div class="paging_simple_numbers" id="">
                    <ul class="pagination">
                      <li
                        class="paginate_button page-item previous disabled"
                        id="_previous"
                      >
                        <a
                          href="#"
                          aria-controls=""
                          data-dt-idx="0"
                          tabindex="0"
                          class="page-link"
                          >Previous</a
                        >
                      </li>
                      <li class="paginate_button page-item active">
                        <a
                          href="#"
                          aria-controls=""
                          data-dt-idx="1"
                          tabindex="0"
                          class="page-link"
                          >1</a
                        >
                      </li>
                      <li class="paginate_button page-item">
                        <a
                          href="#"
                          aria-controls=""
                          data-dt-idx="2"
                          tabindex="0"
                          class="page-link"
                          >2</a
                        >
                      </li>
                      <li class="paginate_button page-item">
                        <a
                          href="#"
                          aria-controls=""
                          data-dt-idx="3"
                          tabindex="0"
                          class="page-link"
                          >3</a
                        >
                      </li>
                      <li class="paginate_button page-item next" id="_next">
                        <a
                          href="#"
                          aria-controls=""
                          data-dt-idx="4"
                          tabindex="0"
                          class="page-link"
                          >Next</a
                        >
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
      </div>
    </div>
  </section>
</template>
 
 
 <script setup>
import Breadcrumb from "@/components/theme/Breadcrumb.vue";


definePageMeta({
  layout: "default",
  middleware: "auth",
  title: "Pending Members",
});
</script>