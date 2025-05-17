$version: "2"
namespace com.jobtracker

use smithy.api#http

@title("Job Tracker Service")
service JobTrackerService {
    version: "2024-05-01",
    operations: [ListCompanies, CreateCompany]
}

@http(method: "GET", uri: "/companies")
operation ListCompanies {
    output: ListCompaniesOutput
}

@http(method: "POST", uri: "/companies")
operation CreateCompany {
    input: CreateCompanyInput,
    output: CreateCompanyOutput
}

structure Company {
    @required
    id: String,
    @required
    name: String,
    @required
    role: String,
    @required
    status: String
}

structure ListCompaniesOutput {
    @required
    companies: CompanyList
}

list CompanyList {
    member: Company
}

structure CreateCompanyInput {
    @required
    name: String,
    @required
    role: String,
    @required
    status: String
}

structure CreateCompanyOutput {
    @required
    company: Company
}
