import React, { Component } from 'react'
import DataTable from "react-data-table-component"
import axios from 'axios'

export default class Get extends Component {
    constructor(props) {
        super(props);
        this.state = {
            patients: []
        }
    }

    componentDidMount() {
        this.getPatients();
    }

    getPatients(){
        axios.get("http://localhost:8000/patients").then(res => {
            if (res.data.success) {
                this.setState({
                    patients: res.data.existingPatients
                });
                console.log(this.state.patients);
            }
        })
    }

    getNumberOfPages(rowCount, rowsPerPage) {
        return Math.ceil(rowCount / rowsPerPage);
    }

    toPages(pages) {
        const results = [];

        for (let i = 1; i < pages; i++) {
            results.push(i);
        }

        return results;
    }

    columns = [
        {
            name: "Name",
            selector: (row) => row.name,
            sortable: true
        },
        {
            name: "Gender",
            selector: (row) => row.gender,
            sortable: true
        },
        {
            name: "Age",
            selector: (row) => row.age,
            sortable: true
        },
        {
            name: "Address",
            selector: (row) => row.address,
            sortable: true
        },
        {
            name: "Blood Type",
            selector: (row) => row.bloodType,
            sortable: true
        },
        {
            name: "Contact Number",
            selector: (row) => row.contact
        },
        {
            name: "Email Address",
            selector: (row) => row.email,
            sortable: true
        }
    ]


    BootyPagination = ({
        rowsPerPage,
        rowCount,
        onChangePage,
        currentPage
    }) => {
        const handleBackButtonClick = () => {
            onChangePage(currentPage - 1);
        };

        const handleNextButtonClick = () => {
            onChangePage(currentPage + 1);
        };

        const handlePageNumber = (e) => {
            onChangePage(Number(e.target.value));
        };

        const pages = this.getNumberOfPages(rowCount, rowsPerPage);
        const pageItems = this.toPages(pages);
        const nextDisabled = currentPage === pageItems.length;
        const previosDisabled = currentPage === 1;

        return (
            <nav>
                <ul className="pagination">
                    <li className="page-item">
                        <button
                            className="page-link"
                            onClick={handleBackButtonClick}
                            disabled={previosDisabled}
                            aria-disabled={previosDisabled}
                            aria-label="previous page"
                        >
                            Previous
                </button>
                    </li>
                    {pageItems.map((page) => {
                        const className =
                            page === currentPage ? "page-item active" : "page-item";

                        return (
                            <li key={page} className={className}>
                                <button
                                    className="page-link"
                                    onClick={handlePageNumber}
                                    value={page}
                                >
                                    {page}
                                </button>
                            </li>
                        );
                    })}
                    <li className="page-item">
                        <button
                            className="page-link"
                            onClick={handleNextButtonClick}
                            disabled={nextDisabled}
                            aria-disabled={nextDisabled}
                            aria-label="next page"
                        >
                            Next
                </button>
                    </li>
                </ul>
            </nav>
        );
    };

    
    filterData(patients, searchKey) {
        const result = patients.filter((patient) =>
            patient.name.toLowerCase().includes(searchKey) || patient.name.toUpperCase().includes(searchKey)  || patient.bloodType.toLowerCase().includes(searchKey) || patient.bloodType.toUpperCase().includes(searchKey)
        )
        this.setState({
            patients: result
          })
    }

    handleSearchArea=(e) =>{
        const searchKey = e.currentTarget.value;
        axios.get("http://localhost:8000/patients").then(res => {
            if (res.data.success) {
                this.filterData(res.data.existingPatients, searchKey)
            }
        })
    }

    SearchPatient = <div className="col-lg-3 mt-2 mb-2">
        <input className="form-control" type="search" placeholder="Search" onChange={this.handleSearchArea}></input>
    </div>


    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-lg-9 mt-2 mb-2">
                        <h4>All Patients</h4>
                    </div>
                </div>
                <DataTable
                            title="Search donors with thier name or blood type"
                            responsive
                            subHeader
                            columns={this.columns}
                            data={this.state.patients}
                            subHeaderComponent={this.SearchPatient}
                            striped={true}
                            highlightOnHover={true}
                            pagination
                            paginationComponent={this.BootyPagination}
                            defaultSortFieldID={1}
                        />

                {/* <button className="btn btn-success"><a href="/add" style={{ textDecoration: "none", color: "white" }}>Create New Post</a></button> */}
            </div>
        )
    }
}
