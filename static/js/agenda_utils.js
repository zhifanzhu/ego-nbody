
export class AgendaWrapper {

    constructor(agenda) {
        this.data = agenda;
        this.video_duration = agenda['video_duration'];
        // drop video_duration from data to keep only person-task mapping
        delete this.data['video_duration'];
    }


    // Input: time (float seconds). Output: float seconds.
    toSourceTime(person, time) {
        const t = Number(time); // float seconds
        const tasks = this.data[person] || [];
        for (const task of tasks) {
            // Expect these fields to be float seconds
            const newStart = Number(task.new_start);
            const newEnd = Number(task.new_end);
            const start = Number(task.start);
            if (newStart <= t && t <= newEnd) {
                const sourceTime = t - newStart + start;
                return sourceTime; // float seconds
            }
        }
        return null;
    }

    toParallelTime(src_time) {
        for (const person in this.data) {
            const tasks = this.data[person] || [];
            for (const task of tasks) {
                const start = Number(task.start);
                const end = Number(task.end);
                if (start <= src_time && src_time <= end) {
                    const newStart = Number(task.new_start);
                    const parallelTime = src_time - start + newStart;
                    console.log(src_time, start, newStart)
                    return {
                        time: parallelTime,
                        person: person
                    };
                }
            }
        }
        return null;

    }
}

// export function concat_all_tasks(agenda) {
//     let all_tasks = [];
//     for (const person in agenda) {
//         for (const task in agenda[person]) {
//             all_tasks.push(agenda[person][task]);
//         }
//     }
//     all_tasks.sort((a, b) => Number(a.start) - Number(b.start));
//     return all_tasks;
// }