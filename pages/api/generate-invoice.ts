import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const invoiceData = await request.json()

        const response = await fetch('https://facturacion.apisperu.com/api/v1/invoice/pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1c2VybmFtZSI6ImRhdmlkZWZxb24iLCJjb21wYW55IjoiMTA3NTU0ODIzNzAiLCJpYXQiOjE3MjE4NDMzNjcsImV4cCI6ODAyOTA0MzM2N30.WnHQXCEM-fiSFmXj8tlUwQNx96TARmyokFnPWjQuUSD9-r5QiiYDQegmMSv9innX_-jLceJdkBGaLsV9Qr-4RdT1myfqnd-9gqsf-p0CfmUxFWzdo99oyNdsy03S9h1kCVVjjc9PV62Co-qfSbLK8BMfFAxF9nXBfsNLs_qGrokxlEjbySwnHULVUueKR1_JekNYZ5BEUHJuJ0SMTIsdirYBudIa0WoOfKG1o-cmpA9BStnZS8touO-JYy7_OGElCH11H2s1DoK2bgAfC4RIqhjr8seVx1ut21B5Hos78bEpcDsJsU02sHX-cNsVS6dgAshuBwtwiE8IVjIVd6ot5Pl5WxrTXC7hDhO66svDW_slBDRSf_o7tvGLMzR1kiZx5USdp8uGVfs_DhRdnWQqKo-ciDNyzSrrMc5BU1sBsj7s1ZHpqKUc1sFd875QnJCnpcWtGKKtz_f4cf5AQvvdVL88uVDi0O2BBmw3RjXBwm8uz4Fw_OEHO5bqwvLfq3Br_2My4Y_gfWyfpC5gHeU63fs3IoFmpxQu7F0fne6SGEpnET8pflAEuTjvAijlQJpdF68Vt2fO4EY4E-X0FeDk8DF6bH9r4N8t3KTHt_53TAW6JUP70PpGChMZkTuLJhu8wnFeCN9ZfQhccf4cD6ZsZFDlWdGsQNimsunXIKh6JTU'
            },
            body: JSON.stringify(invoiceData),
        })

        if (!response.ok) {
            throw new Error('Error generating invoice')
        }

        const pdfBlob = await response.blob()
        return new NextResponse(pdfBlob, {
            headers: {
                'Content-Type': 'application/pdf',
            },
        })
    } catch (error) {
        console.error('Error:', error)
        return new NextResponse(JSON.stringify({ error: 'Error generating invoice' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }
}
