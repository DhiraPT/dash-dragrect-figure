
module DashDragrectFigure
using Dash

const resources_path = realpath(joinpath( @__DIR__, "..", "deps"))
const version = "1.0.0"

include("jl/''_dragrectfigure.jl")

function __init__()
    DashBase.register_package(
        DashBase.ResourcePkg(
            "dash_dragrect_figure",
            resources_path,
            version = version,
            [
                DashBase.Resource(
    relative_package_path = "dash_dragrect_figure.js",
    external_url = nothing,
    dynamic = nothing,
    async = nothing,
    type = :js
),
DashBase.Resource(
    relative_package_path = "dash_dragrect_figure.js.map",
    external_url = nothing,
    dynamic = true,
    async = nothing,
    type = :js
)
            ]
        )

    )
end
end
