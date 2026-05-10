type Props = {
  allFeedback: any[]
  groupFeedback: Record<string, Group>
}

type Group = {
    totalRating: number
    count: number
}

const Statistics = ({ allFeedback, groupFeedback }: Props) => {
    const totals = Object.values(groupFeedback).reduce(
        (acc, group) => {
            acc.totalRating += group.totalRating;
            acc.count += group.count;
            return acc;
        },
        { totalRating: 0, count: 0 }
    );

    const grandAverage =
        totals.count === 0 ? 0 : totals.totalRating / totals.count;

    return (
        <>
            <div className="w-full lg:w-[70%] bg-[#E0A387] p-5 shadow-md">
                <h1 className="text-4xl text-white text-center mb-4 font-bold">{grandAverage.toFixed(1)} ({allFeedback.length} Reviews)</h1>
                <div className="w-full flex items-center gap-4 mb-5 rounded-md justify-center">
                {
                    Object.keys(groupFeedback).length > 0 ? (
                        Object.keys(groupFeedback).map((type) => {
                            const averageRating = (
                                groupFeedback[type].totalRating/groupFeedback[type].count
                            )
                            return (
                                <div className="card p-6 w-72 rounded-md bg-white shadow-md">
                                    <h3 className="font-bold text-xl">{type}</h3>
                                    <h4>Average Rating: <span>{averageRating.toFixed(1)}</span></h4>
                                    <h4>Total Reviews: <span>{groupFeedback[type].count}</span></h4>
                                </div>
                            )
                        })
                    ) : ""
                }
                </div>
                {
                    allFeedback.map((feedback: any, index: number) => {
                        return (
                            <div key = {index} className = "flex p-4 rounded-md bg-white shadow-md flex-col items-start justify-between mb-5">
                                <h2><span className="font-bold">Feedback Type: </span>{feedback.feedbackType}</h2>
                                {feedback.feedbackType === "Other" && (
                                    <h2><span className="font-bold">Other (please specify): </span>{feedback.otherFeedback}</h2>
                                )}
                                <h2><span className="font-bold">Name: </span>{feedback.name}</h2>
                                <h2><span className="font-bold">Rating: </span>{parseFloat(feedback.rating).toFixed(1)}</h2>
                                <h2><span className="font-bold">Comment: </span>{feedback.comment}</h2>
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}


export default Statistics