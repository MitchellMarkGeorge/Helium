
export const assertIsDefined = <T>(value: T, message: string): asserts value is NonNullable<T> => {
    if (value === undefined || value === null) {
        throw new Error(message);
    }
}

export async function wait(miliseconds: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, miliseconds);
    })
  }