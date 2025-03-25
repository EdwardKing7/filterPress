export class Semaphore {
    constructor(concurrency) {
        this.concurrency = concurrency;
        this.current = 0;
        this.queue = [];
    }

    async acquire() {
        if (this.current < this.concurrency) {
            // 如果当前使用的资源数量小于并发限制，直接获取锁
            this.current++;
            return;
        }

        let timeoutId;
        const timeoutPromise = new Promise((resolve) => {
            timeoutId = setTimeout(() => {
                // 超时后，将等待队列清空，将 current 置为 0，并认为获取到锁
                this.queue = [];
                this.current = 0;
                this.current++;
                resolve();
            }, 3000);
        });

        const waitPromise = new Promise((resolve) => {
            this.queue.push(() => {
                clearTimeout(timeoutId);
                resolve();
            });
        });

        // 竞争超时和等待锁释放
        await Promise.race([timeoutPromise, waitPromise]);
        // 无论是否超时，只要执行到这里，都认为已经获取到锁
        this.current++;
    }

    release() {
        if (this.queue.length > 0) {
            // 如果队列中有等待的请求，取出一个并执行
            const next = this.queue.shift();
            next();
        } else {
            // 如果队列中没有等待的请求，减少当前使用的资源数量
            this.current--;
        }
    }
}

// // 默认导出 Semaphore 类
// export default Semaphore;